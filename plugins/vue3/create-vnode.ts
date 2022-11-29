import { useMDXComponents } from './context';
import { createVNode, VNodeTypes, defineComponent, PropType, Fragment } from 'vue'

const TYPE_PROP_NAME = 'mdxType'

const DEFAULTS = {
  inlineCode: 'code',
  wrapper: (props, { slots }) => createVNode(Fragment, {}, slots)
}

const MDXCreateElement = defineComponent({
  name: 'MDXCreateElement',
  props: {
    components: {
      type: Object as PropType<Record<string, VNodeTypes>>,
      default: () => ({})
    },
    originalType: String,
    mdxType: { type: String, default: TYPE_PROP_NAME },
    parentName: String
  },
  setup(props, { slots }) {
    const componentsRef = useMDXComponents(() => props.components)

    return () => {
      const components = componentsRef.value
      const { parentName, originalType, mdxType: type, ...etc } = props

      const Component =
        components[`${parentName}.${type}`] ||
        components[type] ||
        DEFAULTS[type] ||
        originalType

      return createVNode(Component, { ...etc }, slots)
    }
  }
})
export default function mdx(
  type: VNodeTypes,
  props: any,
  children: unknown,
  patchFlag?: number,
  dynamicProps?: string[] | null,
  isBlockNode?: boolean
) {
  let component = type
  let newProps = props

  const mdxType = props && props.mdxType

  if (typeof type === 'string' || mdxType) {
    component = MDXCreateElement
    newProps = {}

    for (let key in props) {
      if (Object.hasOwnProperty.call(props, key)) {
        newProps[key] = props[key]
      }
    }

    newProps.originalType = type
    newProps[TYPE_PROP_NAME] = typeof type === 'string' ? type : mdxType
  }

  return createVNode(component, newProps, children, patchFlag, dynamicProps, isBlockNode)
}
