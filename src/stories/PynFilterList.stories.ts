import { computed, ref } from 'vue'
import type { Meta, StoryObj } from '@storybook/vue3'
import PynButton from '../components/PynButton.vue'
import PynFilterList from '../components/PynFilterList.vue'
import { rows, sortControl, typeControl } from './filter-list-data'

const meta: Meta<typeof PynFilterList> = {
  title: 'Lists/PynFilterList',
  component: PynFilterList,
  args: { noun: 'repository', plural: 'repositories', searchLabel: 'Find a repository' },
  parameters: { layout: 'padded' },
}
export default meta
type Story = StoryObj<typeof PynFilterList>

const rowsTemplate = `<li v-for="r in pageRows" :key="r.id">
  <strong><a href="#">{{ r.name }}</a></strong> <small>{{ r.kind }}</small><br /><small>{{ r.note }}</small>
</li>`

export const Interactive: Story = {
  render: (args) => ({
    components: { PynFilterList, PynButton },
    setup() {
      const query = ref('')
      const type = ref('all')
      const sort = ref('updated')
      const page = ref(1)
      const pageSize = 10
      const matching = computed(() =>
        rows
          .filter(
            (r) =>
              (type.value === 'all' || r.kind === type.value) &&
              r.name.includes(query.value.trim()),
          )
          .sort((a, b) =>
            sort.value === 'name' ? a.name.localeCompare(b.name) : a.updated - b.updated,
          ),
      )
      const pageRows = computed(() =>
        matching.value.slice((page.value - 1) * pageSize, page.value * pageSize),
      )
      const controls = computed(() => [typeControl(type.value), sortControl(sort.value)])
      const control = (id: string, v: string) => {
        if (id === 'type') type.value = v
        else sort.value = v
        page.value = 1
      }
      return {
        args,
        query,
        page,
        pageSize,
        pageRows,
        controls,
        control,
        count: computed(() => matching.value.length),
      }
    },
    template: `<PynFilterList v-bind="args" v-model:query="query" v-model:page="page" :page="page" :page-size="pageSize"
        :count="count" :controls="controls" @control="control" @update:page="page = $event">
      <template #actions><PynButton label="New" /></template>
      ${rowsTemplate}
    </PynFilterList>`,
  }),
}

const staticStory = (args: Partial<InstanceType<typeof PynFilterList>['$props']>): Story => ({
  args: { controls: [typeControl(), sortControl()], ...args },
  render: (a) => ({
    components: { PynFilterList },
    setup: () => ({ a, pageRows: rows.slice(0, Math.min(5, a.count)) }),
    template: `<PynFilterList v-bind="a">${rowsTemplate}</PynFilterList>`,
  }),
})

export const Paginated = staticStory({ count: 74, pageSize: 5, page: 4 })
export const SinglePage = staticStory({ count: 3 })
export const Empty = staticStory({
  count: 0,
  emptyTitle: 'No repositories yet',
  emptyDescription: 'Create a repository to start tracking files.',
})
export const NoMatch = staticStory({ count: 0, filtered: true })
export const Unsupported = staticStory({ count: 0, emptyKind: 'unsupported' })
export const Loading = staticStory({ count: 0, loading: true })
export const ErrorState = staticStory({ count: 0, error: 'Could not load repositories.' })
