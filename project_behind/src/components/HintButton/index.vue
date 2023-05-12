
<template>
<!-- 封装一个鼠标停在按钮上面，会显示文字效果的按钮 -->
  <a :title="title" style="margin:10px">
    <el-button v-bind="$attrs" v-on="$listeners" style="margin-right:5px"></el-button>
  </a>
</template>

<script>
export default {
    name:'HintButton',
    props:['title']
}
</script>

<style>

</style>