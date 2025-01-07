import { mount } from '@vue/test-utils';
import MyComponent from '../../src/components/Sidebar.vue';

test('renders correctly', () => {
  const wrapper = mount(MyComponent);
  expect(wrapper.text()).toContain('Hello World');
});
