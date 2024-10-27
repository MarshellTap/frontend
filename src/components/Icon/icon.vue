<script setup>
import { computed } from 'vue'
import IconStyle from "./icon.module.css"

const props = defineProps({
	name: String,
	customFill: {
		type: String,
		required: false,
		default: null,
	},
})

const styled = computed(() => {
	let style = ''
	style += 'fill: '
	if (!props.customFill) {
		style += 'currentColor'
	} else {
		style += 'url(#' + props.customFill + ')'
	}
	return style
})
</script>

<template>
	<svg :class="{ [IconStyle['icon']]: true }" :data-icon-tag="props.name" :style="styled">
		<use :xlink:href="'#icon-' + props.name"></use>
		<slot />
	</svg>
</template>
