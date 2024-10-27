export default (ref_code, for_share = true) => {
    const url = import.meta.env.VITE_TELEGRAM_BOT + "?start=" + ref_code,
        text = "🎶Marshell: Play, Earn - Your Airdrop Adventure Awaits!\n🎁Ready to earn? Join the airdrop now!";
    return for_share ? ('https://t.me/share/url?url=' + encodeURIComponent(url) + '&text=' + encodeURIComponent(text)) : url;
}