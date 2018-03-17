<template>
    <div id="agentCardList">
      <transition>
        <keep-alive>
            <router-view></router-view>
        </keep-alive>
      </transition>
    </div>
</template>

<script>
export default {
  name: 'agentCardList'
}
</script>

<style lang="scss">
.bg-img {
   background-position: center;
   background-repeat: no-repeat;
   background-size: cover;
 }
.userCardList{
  background: #f4f4f4;
  height: 100vh;
  width: 100vw;
}
 .Card-wrapper {
   padding: 2vw;
 }
  .card-list{
    float: left;
    width: 47vw;
    &:nth-of-type(odd) {
      margin-right: 2vw;
    }
    .img-wrapper{
        height: 73.32vw;
        width: 100%;
        overflow: hidden;
    }
    .agent-desc{
      font-size: 1.4rem;
      display: flex;
      height: 3rem;
      align-items: center;
      justify-content: center;
      margin-bottom: 2.5rem;
      span{
        flex: 1;
        font-size: 1.4rem;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        background-position: 50% center;
        &.mdgrade {
          margin-left: -1rem;
        }
      }
    }
  }
</style>
