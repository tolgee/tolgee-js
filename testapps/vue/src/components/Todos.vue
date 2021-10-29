<script lang="tsx">
import { defineComponent } from 'vue';
import { T, TolgeeMixin } from '@tolgee/vue';

import TodoItem from './TodoItem.vue';
import LanguageSelect from './LanguageSelect.vue';
import Footer from './Footer.vue';
import Page from './Page.vue';

export default defineComponent({
  mixins: [TolgeeMixin],
  name: 'Todos',
  data() {
    return {
      newItem: '',
      items: [
        { text: 'Install library' },
        { text: 'Start the app' },
        { text: 'Rock and roll!' },
      ],
    };
  },
  methods: {
    handleSubmit(e: Event) {
      e.preventDefault();
      if (this.$data.newItem) {
        this.$data.items.push({ text: this.$data.newItem });
      }
      this.$data.newItem = '';
    },
    handleRemove(index: number) {
      this.$data.items = this.$data.items.filter((_, i) => i !== index);
    },
  },
  created() {
    document.title = this.$t({ key: 'sampleApp.hello_world!', noWrap: true });
  },
  beforeUpdate() {
    document.title = this.$t({ key: 'sampleApp.hello_world!', noWrap: true });
  },
  render() {
    return (
      <div>
        <LanguageSelect />
        <h1>
          <T keyName="sampleApp.hello_world!" />
        </h1>
        <form class="inputContainer" onSubmit={this.handleSubmit}>
          <input
            value={this.newItem}
            onChange={(e: Event) => {
              // @ts-ignore
              this.newItem = e.target.value;
            }}
          />
          <button type="submit">
            <T keyName="add" />
          </button>
        </form>
        <div class="items">
          {this.items.map((item, i) => (
            <TodoItem
              key={i}
              todo={item}
              index={i}
              onRemove={this.handleRemove}
            />
          ))}
        </div>
        <Footer />
        <Page />
      </div>
    );
  },
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.inputContainer {
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>
