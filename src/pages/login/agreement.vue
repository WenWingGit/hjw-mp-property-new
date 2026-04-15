<route lang="json5" type="page">
{
  layout: 'default',
  style: {
    navigationBarTitleText: '易联服务协议',
    navigationBarTextStyle: 'white',
  },
}
</route>

<template>
  <view class="page">
    <view class="relative z-2">
      <NavTopBar bg-color="#000248" title="易联服务协议" show-back />

      <view class="page-container sx-pt-20 sx-pb-20">
        <view class="agreement-content box-white sx-p-36 sx-lh-60">
          <rich-text :nodes="protocol" />
        </view>
      </view>
    </view>

    <BottomBar confirm-text="返回" @confirm="handleSubmit"></BottomBar>
  </view>
</template>

<script setup lang="ts">
const protocol = ref(`
<h4>用户协议</h4>
<p>
  本协议是您与我们之间关于您使用我们的服务的协议。请您在使用我们的服务前，仔细阅读本协议的所有内容。
</p>
<h5>一、服务条款</h5>
<p>1.1 本服务仅供您个人非商业用途使用。您不得将本服务用于任何商业目的。</p>
<p>1.2 您在使用本服务时，必须遵守所有适用的法律法规。</p>
<h5>二、知识产权</h5>
<p>2.1 本服务所有权利，包括但不限于著作权、商标权、专利权等，均归我们所有。</p>
<p>2.2 您不得复制、修改、传播或以其他方式使用本服务的任何部分，除非我们明确允许。</p>
<h5>三、隐私政策</h5>
<p>3.1 我们尊重您的隐私权。我们将根据隐私政策保护您的个人信息。</p>
<p>3.2 您在使用本服务时，需要提供一些个人信息。我们将根据隐私政策使用这些信息。</p>
<h5>四、免责声明</h5>
<p>4.1 本服务按“原样”提供，不提供任何明示或默示的保证。</p>
<p>4.2 我们对本服务的任何错误或中断不承担任何责任。</p>
<h5>五、修改和终止</h5>
<p>5.1 我们保留修改或终止本服务的权利。</p>
<p>5.2 如果我们修改或终止本服务，我们将尽力通知您，但不保证一定能通知到您。</p>
<h5>六、法律适用和管辖</h5>
<p>6.1 本协议的解释、执行和争议解决均适用相关法律法规。</p>
<p>6.2 本协议的任何争议或纠纷，均应通过友好协商解决。如协商不成，应提交相关法院裁决。</p>
<h5>七、接受本协议</h5>
<p>7.1 您在使用本服务时，即视为您已阅读、理解并接受本协议的所有条款。</p>
<p>7.2 如果您不同意本协议的任何条款，请您停止使用本服务。</p>
`)

function handleSubmit() {
  uni.navigateBack()
}
</script>

<style lang="scss" scoped></style>
