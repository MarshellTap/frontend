import {reactive} from "vue";
import showPopup from "~/functions/showPopup.js";
import secondsToHMS from "~/functions/secondsToHMS.js";
import store from "~/store/index.js";
import moment from "moment";
import getRandomInt from "~/functions/getRandomInt.js";
import {uuid} from "vue-uuid";
import {showHeaderAndBottomMenu} from "~/functions/components.helper.js";
import routes from "~/routes.js";
import * as spine from "@esotericsoftware/spine-player";
import sleep from "~/functions/sleep.js";

const skeletonJson = new URL('~/assets/spine/skeleton.json', import.meta.url).href;
const skeletonAtlas = new URL('~/assets/spine/skeleton.atlas', import.meta.url).href;

const game = reactive({
    tracks: [],
    track: {
        duration: 0,
        seek: 0,
        info: {
            manager: null
        },
        interval: null
    },
    paused: false,
    starting: {
        status: false,
        timeout: null
    },
    tap: {
        amount: 0,
        timeout: null,
        limit: false
    },
    alert: {
        scale: false
    },
    audio: {
        fade: {
            interval: null
        }
    },
    animations: {
        spine: {
            started: false,
            current: -1,
            timing: [
                {name: 'solo_M', timing: 2000},
                {name: 'solo_X', timing: 4000},
                {name: 'solo_R', timing: 4000},
            ],
            timeout: null
        },
        items: [],
        repeat: {
            max: 2,
            left: 0,
            right: 0
        }
    },
    sound: {
        enable: true
    },
    graphql: {
        mutate: {
            end: () => {}
        }
    }
})

let spinePlayer = null;

const initializePlayer = async (container) => {
    if (spinePlayer) return;
    spinePlayer = new spine.SpinePlayer(container, {
        skeleton: skeletonJson,
        atlas: skeletonAtlas,
        animations: ['idle', 'solo_R', 'solo_M', 'solo_X'],
        showControls: false,
        backgroundColor: null,
        fullScreenBackgroundColor: null,
        alpha: true,
        animation: 'idle',
        viewport: {
            x: -300 / 2,
            y: -130,
            width: 300,
            height: 675
        },
        premultipliedAlpha: false
    });
}

const makeAnimation = () => {
    if (!game.animations.spine.started) return;
    game.animations.spine.current = (game.animations.spine.current >= 2 || game.animations.spine.current === -1) ? 0 : game.animations.spine.current + 1;
    const animationInfo = game.animations.spine.timing[game.animations.spine.current];
    spinePlayer.setAnimation(animationInfo.name);
    game.animations.spine.timeout = setTimeout(() => makeAnimation(), 1500);
}

const stopAnimation = () => {
    if (!game.animations.spine.started) return;
    if (game.animations.spine.timeout) {
        clearInterval(game.animations.spine.timeout);
        game.animations.spine.timeout = null;
    }
    game.animations.spine.current = -1;
    game.animations.spine.started = false;
    spinePlayer.setAnimation('idle');
}

const updateTrackInfo = (manager) => {
    game.track.duration = Math.trunc(manager.duration());
    game.track.seek = Math.trunc(manager.seek());
    if (game.track.duration === game.track.seek) {
        clearInterval(game.track.interval);
        return end();
    }
}

const setTrackTimer = (track_id, seconds = 0, history_created_at = 0) => {
    const trackIndex = game.tracks.findIndex(track => track.id === track_id)
    if (trackIndex === -1) return
    game.tracks[trackIndex].next_timer = seconds;
    game.tracks[trackIndex].history_created_at = history_created_at;
}

const start = async (track_id) => {
    const selectedIndex = game.tracks.findIndex(track => track.id === track_id)
    if (selectedIndex === -1) return showPopup("error", "The track you have selected was not found")
    const track = game.tracks[selectedIndex]
    if (track.next_timer > 0) return showPopup("error", "You can listen to this track via " + secondsToHMS(track.next_timer))
    game.starting.status = true;
    game.starting.timeout = setTimeout(() => {
        store.dispatch('setDropGameStarted', true);
        game.track.info = track;
        game.track.interval = setInterval(() => updateTrackInfo(track.manager), 100);
        track.manager.play();
        setTimeout(() => game.starting.status = false, 400);
        game.starting.timeout = null;
        createTapTimeout();
    }, (700 * 3) + 600);
}

const tap = async (e) => {
    if (e.y < 95 || game.tap.limit) return;
    if (!store.state.drop_game.started) {
        game.alert.scale = true;
        return setTimeout(() => game.alert.scale = false, 80);
    }
    const startAnimation = () => {
        if (!game.animations.spine.started) {
            game.animations.spine.started = true;
            makeAnimation();
        }
    }
    if (game.tap.timeout) {
        clearTimeout(game.tap.timeout)
        game.tap.timeout = null;
        if (!game.track.info.manager.playing()) {
            game.track.info.manager.play();
        }
    }
    if (game.paused || game.audio.fade.interval) {
        const currentSeconds = game.track.info.manager.seek(),
            amount = game.audio.fade.interval ? 3 : 4;
        game.track.info.manager.seek(amount > currentSeconds ? 0 : currentSeconds - amount);
        game.track.info.manager.volume(1);
    }
    if (game.audio.fade.interval) {
        clearInterval(game.audio.fade.interval)
        game.audio.fade.interval = null;
    }
    if (game.paused) {
        game.paused = false;
        startAnimation();
        if (!game.track.info.manager.playing()) {
            game.track.info.manager.play();
        }
    }
    startAnimation();
    game.tap.amount++;
    game.tap.limit = true;
    setTimeout(() => game.tap.limit = false, 50);
    const trackLeft = game.track.duration - game.track.seek;
    if (trackLeft > 9) createTapTimeout();
    return makeAltAnimation();
}

const end = async () => {
    if (game.track.duration !== game.track.seek) return;
    const nowUnix = moment().unix();
    const req = await game.graphql.mutate.end();
    setTrackTimer(game.track.info.id, 3600 * 24, nowUnix);
    await reset();
    if (!req || !req.data || !req.data.completeDropGame) return;
    const data = req.data.completeDropGame;
    await store.dispatch('user/setUserBalance', data.balance);
    return showPopup("success", "You got +" + data.amount + " notes!", "Complete")
}

const reset = async () => {
    if (game.track.info.manager && game.track.info.manager.playing()) {
        game.track.info.manager.stop();
    }
    await store.dispatch('setDropGameStarted', false);
    game.track.info = {
        manager: null
    };
    game.track.duration = 0;
    game.track.seek = 0;
    game.tap.amount = 0;
    game.tap.limit = false;
    game.paused = false;
    game.animations.items = [];
    game.animations.repeat.left = 0;
    game.animations.repeat.right = 0;
    game.alert.scale = false;
    stopAnimation();
    if (game.starting.timeout) {
        clearTimeout(game.starting.timeout);
        game.starting.timeout = null;
    }
    if (game.tap.timeout) {
        clearTimeout(game.tap.timeout);
        game.tap.timeout = null;
    }
    if (game.track.interval) {
        clearInterval(game.track.interval);
        game.track.interval = null;
    }
    if (game.audio.fade.interval) {
        clearInterval(game.audio.fade.interval);
        game.audio.fade.interval = null;
    }
}

const createTapTimeout = () => {
    game.tap.timeout = setTimeout(() => {
        game.paused = true;
        game.audio.fade.interval = setInterval(() => {
            const currentVolume = game.track.info.manager.volume(),
                newStringVolume = Number(currentVolume - 0.01).toFixed(2);
            const intVolume = Number(newStringVolume);
            game.track.info.manager.volume(intVolume);
            if (intVolume === 0) {
                game.track.info.manager.pause();
                stopAnimation();
                game.track.info.manager.volume(1);
                clearInterval(game.audio.fade.interval)
                game.audio.fade.interval = null;
            }
        }, 10);
    }, 3000);
}

const makeAltAnimation = () => {
    /*
      Percents:
       left: 5 to 20
       right: 75 to 95
     */
    const align = getRandomInt(1, 4),
        sizes = ['s', 'm', 'l', 'xl'];
    const wordAlign = game.animations.repeat.left >= game.animations.repeat.max ? "right" : (game.animations.repeat.right >= game.animations.repeat.max ? 'left' : (align === 1 || align === 3 ? 'left' : 'right'));
    if (game.animations.repeat.left >= game.animations.repeat.max) {
        game.animations.repeat.left = 0;
    } else if (game.animations.repeat.right >= game.animations.repeat.max) game.animations.repeat.right = 0
    const leftAlign = getRandomInt(wordAlign === 'right' ? 75 : 5, wordAlign === 'right' ? 95 : 20),
        topAlign = getRandomInt(30, 45),
        rotateDeg = getRandomInt(wordAlign === 'right' ? 10 : 335, wordAlign === 'right' ? 25 : 350);
    const animationUuid = uuid.v4();
    game.animations.items.push({
        uuid: animationUuid,
        top: topAlign, left: leftAlign, rotate: rotateDeg,
        size: sizes[getRandomInt(0, sizes.length - 1)]
    })
    game.animations.repeat[wordAlign === 'right' ? 'left' : 'right'] = 0;
    game.animations.repeat[wordAlign]++;
    return setTimeout(() => {
        game.animations.items = game.animations.items.filter(animation => animation.uuid !== animationUuid);
    }, 800)
}

const toggleSound = () => {
    const newStatus = !game.sound.enable;
    Howler.mute(!newStatus)
    game.sound.enable = newStatus
}

const closeGame = async () => {
    await showHeaderAndBottomMenu()
    return routes.replace('/');
}

export {
    start,
    reset,
    tap,
    closeGame,
    toggleSound,
    setTrackTimer,
    game,
    initializePlayer,
    spinePlayer
}