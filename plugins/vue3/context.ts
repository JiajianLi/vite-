import { defineComponent, PropType, VNodeTypes, computed, provide, inject, ref } from 'vue'


export const contextKey = '__MDX_PROVIDE_KEY__'

export const MDXProvide = defineComponent({
  name: 'MDXProvider',
  props: {
    components: {
      type: Object as PropType<Record<string, VNodeTypes>>,
      require: true
    }
  },
  setup (props, { slots }) {
    const componentsRef = computed(() => props.components)

    provide(contextKey, componentsRef.value)

    return () => slots.default && slots.default()
  }
}) 

const defaultComponentsRef = ref();
export const useMDXComponents = (getPropsComponents: () => Record<string, VNodeTypes>) => {
  const providedComponentsRef = inject(contextKey, defaultComponentsRef)

  const mergedComponentsRef = computed(() => ({
    ...providedComponentsRef.value,
    ...getPropsComponents()
  }))

  return mergedComponentsRef
}
