<script setup lang="ts">
const paths: Record<string, string> = {
  home: 'M4 11 12 4l8 7M6 10v10h12V10',
  repo: 'M6 4h12v16H6zM6 16h12M9 8h6',
  settings:
    'M12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM19 12l2-1-2-4-2 1a7 7 0 0 0-2-1l-1-2H10L9 7a7 7 0 0 0-2 1L5 7l-2 4 2 1a7 7 0 0 0 0 2l-2 1 2 4 2-1a7 7 0 0 0 2 1l1 2h4l1-2a7 7 0 0 0 2-1l2 1 2-4-2-1a7 7 0 0 0 0-2z',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM16 16l5 5',
  plus: 'M12 5v14M5 12h14',
  bell: 'M6 16v-5a6 6 0 0 1 12 0v5l2 2H4zM10 21h4',
  close: 'M6 6l12 12M18 6 6 18',
  chevron: 'm6 9 6 6 6-6',
  menu: 'M4 7h16M4 12h16M4 17h16',
  key: 'M8 14a4 4 0 1 1 3-6.5L21 7v4h-3v3h-3v-3h-4.5A4 4 0 0 1 8 14z',
  folder: 'M3 6a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z',
  file: 'M7 3h7l5 5v13H7zM14 3v5h5',
  branch: 'M7 4v12M17 8a2 2 0 1 0 0-.01M7 18a2 2 0 1 0 0-.01M17 10c0 4-10 2-10 6',
  lock: 'M7 11h10v9H7zM9 11V8a3 3 0 0 1 6 0v3',
  info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v5M12 8v.01',
  'check-circle': 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM8 12l3 3 5-6',
  alert: 'M12 4 3 20h18zM12 10v4M12 17v.01',
  stop: 'M8 3h8l5 5v8l-5 5H8l-5-5V8zM12 8v5M12 16v.01',
  code: 'm8 8-5 4 5 4M16 8l5 4-5 4M14 5l-4 14',
  insights: 'M4 4v16h16M8 16v-4M12 16V8M16 16v-6',
  check: 'm5 12 5 5 9-10',
  history: 'M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5M12 7v5l3 2',
  list: 'M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  filter: 'M4 6h16M7 12h10M10 18h4',
  user: 'M12 4a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM4 20c1-4 4-6 8-6s7 2 8 6',
  star: 'm12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2L12 17.2 6.5 20.2l1-6.2L3 9.6l6.2-.9z',
  fork: 'M7 4a2 2 0 1 0 0 .01M17 4a2 2 0 1 0 0 .01M12 20a2 2 0 1 0 0 .01M7 6v2a3 3 0 0 0 3 3h4a3 3 0 0 0 3-3V6M12 11v7',
  copy: 'M9 9h11v11H9zM5 15V4h11',
  book: 'M3 5c3-1 6-1 9 1v14c-3-2-6-2-9-1zM21 5c-3-1-6-1-9 1v14c3-2 6-2 9-1z',
  tag: 'M3 12V4h8l10 10-8 8zM7.5 8v.01',
  download: 'M12 4v11M7 11l5 5 5-5M5 20h14',
}

defineProps<{ name: string }>()
</script>

<template>
  <svg
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <path :d="paths[name] ?? ''" />
  </svg>
</template>
