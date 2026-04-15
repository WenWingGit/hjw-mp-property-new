<template>
  <scroll-view scroll-x>
    <view class="flex sx-pb-10 sx-gap-10" style="text-wrap: nowrap">
      <view v-for="item in props.list" :key="item.id" class="inline-block">
        <PageTag
          :type="item.id === current ? 'primary' : 'info'"
          :name="item.name"
          :closeabled="false"
          @click-item="onClickTag(item.id)"
        />
      </view>
    </view>
  </scroll-view>
</template>

<script lang="ts" setup>
interface RootObject {
  id: number
  name: string
}
interface IProps {
  list: RootObject[]
  current: number
}
const props = withDefaults(defineProps<IProps>(), {
  list: () => [],
  current: -1,
})

const emit = defineEmits<{
  (e: 'update:current', id: number): void
}>()

const onClickTag = (id: number) => {
  emit('update:current', id)
}
</script>

<style lang="scss" scoped>
//
</style>
