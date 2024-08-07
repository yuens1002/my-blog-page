'use client';

import { Fragment } from 'react';

type CategoryFieldProps = {
  children: React.ReactNode;
};

export default function CategoryField({
  children,
}: CategoryFieldProps) {
  // const [query, setQuery] = useState('');
  // const [selected, setSelected] = useState<Person | null>(people[1]);

  // const filteredPeople =
  //   query === ''
  //     ? people
  //     : people.filter((person) => {
  //         return person.name
  //           .toLowerCase()
  //           .includes(query.toLowerCase());
  //       });

  return <Fragment>{children}</Fragment>;
}
