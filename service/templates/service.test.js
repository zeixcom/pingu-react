import { <%= camel %> } from './<%= dashed %>';

describe('<%= pascal %>', () => {
  test('<%= camel %> greets a person by name.', () => {
    expect(<%= camel %>('John')).toBe('Hello John!');
  });

  test('<%= pascal %> greets the world if no name was given.', () => {
    expect(<%= camel %>()).toBe('Hello World!');
  });
});
