<script lang="ts">
  import type { Point } from '../interfaces/point';
  import { blockSize } from '../page-interactive';

  export let size: Point = { x: 0, y: 0 };
  export let position: Point = { x: 0, y: 0 };
  export let color = '';
  export let quality: number | null;
  export let inactive = false;
  export let active = false;

  $: x = position.x * blockSize;
  $: y = position.y * blockSize;
  $: w = size.x * blockSize;
  $: h = size.y * blockSize;
</script>

<div
  class="highlight-block"
  style="top: {y}px; left: {x}px; width: {w}px; height: {h}px; border-color: {color};"
  class:inactive
  class:active
  on:click
>
  <span class="quality-label" style="background-color: {color};">
    {quality}%
  </span>
</div>

<style lang="scss">
  @import './ItemHighlight';
</style>
