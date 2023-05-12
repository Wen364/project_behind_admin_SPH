<template>
  <div>
        <!-- 头部 -->
        <div class="card-header">
            <span>{{title}}</span>
            <svg t="1683717983268" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1453" width="16" height="16"><path d="M536 480v192a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16V480a16 16 0 0 1 16-16h16a16 16 0 0 1 16 16z m-32-128h16a16 16 0 0 1 16 16v32a16 16 0 0 1-16 16h-16a16 16 0 0 1-16-16v-32a16 16 0 0 1 16-16z m8 448c159.056 0 288-128.944 288-288s-128.944-288-288-288-288 128.944-288 288 128.944 288 288 288z m0 48c-185.568 0-336-150.432-336-336s150.432-336 336-336 336 150.432 336 336-150.432 336-336 336z" fill="#000000" p-id="1454"></path></svg>
        </div>
        <!-- 内容 -->
        <div class="card-container">{{count}}</div>
        <!-- 图表区域 -->
        <div class="card-charts">
            <slot name="charts"></slot>
        </div>
        <!-- 底部 -->
        <div class="card-footer">
            <slot name="footer"></slot>
        </div>
  </div>
</template>

<script>
export default {
    name:'Detail',
    props:['title','count']
}
</script>

<style scoped>
.card-header{
    display: flex;
    justify-content: space-between;
    color: #d9d9d9;
    font-size: 15px;
}
.card-container{
    font-size: 30px;
    padding: 10px 0;
}
.card-charts{
    height: 60px;
    width: 100%;
    /* border: 1px solid; */
    font-size: 14px;
    line-height: 55px;
}
.card-footer{
    height: 20px;
    font-size: 15px;
    border-top: 1px solid #eee;
    margin-top: 5px;
    padding: 15px 0;
}
</style>