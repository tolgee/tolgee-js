<script lang="tsx">
import { defineComponent, PropType } from 'vue';
import { T } from '@tolgee/vue';

export default defineComponent({
  name: 'TodoItem',
  props: {
    todo: Object as PropType<{ text: string }>,
    index: Number,
  },
  emits: ['remove'],
  methods: {
    handleClick() {
      this.$emit('remove', this.$props.index);
    },
  },
  render() {
    return (
      <li class="todo">
        <div>{this.todo?.text}</div>
        <button onClick={this.handleClick}>
          <T
            keyName="remove"
            parameters={{ index: String(this.$props.index) }}
          />
        </button>
      </li>
    );
  },
});
</script>

<style scoped>
.todo {
  display: flex;
  justify-content: space-between;
  padding: 5px 0px 5px 0px;
  font-size: 16px;
  width: 100%;
}
</style>
