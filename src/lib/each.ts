import { Children } from 'react';

export const Each = <T>({
  render,
  of
}: {
  render: (item: T, index: number) => JSX.Element;
  of: T[];
}) => Children.toArray(of.map((item, index) => render(item, index)));
