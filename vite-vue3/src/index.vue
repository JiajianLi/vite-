<template>
<div class="pay">
  <PasswordInput
    ref="passwordInputRef"
    v-model="password"
    has-gap
    @complete="onPasswordInputComplete"></PasswordInput>
</div>
</template>

<script>
import {
  ref,
  onMounted
} from 'vue';
import PasswordInput from './PasswordInput.vue';

export default {
  name: "PayDialog",
  components: {
    PasswordInput
  },
  setup (props, ctx) {
    let passwordInputRef = ref(null);
    let password = ref('');

    let onPasswordInputComplete = function (pwd) {
      console.log('密码输入完成: ', pwd);
    };

    onMounted(function () {
      // 让密码框获得焦点
      passwordInputRef.value.focus();
    });

    return {
      password,
      passwordInputRef,

      onPasswordInputComplete
    };
  }
};
</script>