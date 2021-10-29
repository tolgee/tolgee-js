<script lang="tsx">
import { defineComponent, PropType } from 'vue';
import { T, TolgeeMixin } from '@tolgee/vue';

export default defineComponent({
  mixins: [TolgeeMixin],
  name: 'Page',
  props: {
    todo: Object as PropType<{ text: string }>,
    index: Number,
  },
  data() {
    return {
      disappeared: false,
    };
  },
  methods: {
    disappear() {
      this.disappeared = true;
    },
  },
  render() {
    return (
      <div>
        <h1>
          <T keyName="sampleApp.hello_world!" />
        </h1>
        <h1>
          <T keyName="just_english" />
        </h1>
        {!this.disappeared && (
          <button onClick={() => this.disappear()}>
            <T keyName="disappears_on_click" />
          </button>
        )}

        <div title={this.$t('sampleApp.hello_world!')}>
          <h3>Div with title</h3>
        </div>

        <div aria-label={this.$t('sampleApp.hello_world!')}>
          <h3>Div with aria label</h3>
        </div>

        <div>
          <h3>NO_WRAP strategy</h3>
          <T keyName="sampleApp.hello_world!" strategy="NO_WRAP" />
        </div>

        <div>
          <h3>ELEMENT_WRAP strategy</h3>
          <T
            keyName="sampleApp.hello_world!"
            strategy="ELEMENT_WRAP"
            parameters={{ name: `<img onerror='alert("hou")'/>` }}
          />
        </div>

        <div>
          <h3>Default value</h3>
          <T strategy="ELEMENT_WRAP" keyName="unknown key">
            This is default!
          </T>
        </div>

        <div>
          <h3>Key is default value</h3>
          <T strategy="ELEMENT_WRAP" keyName="unknown key" />
        </div>

        <div>
          {this.$t('second', undefined, true)}
          {this.$t('hey', undefined, false)}
        </div>
      </div>
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
