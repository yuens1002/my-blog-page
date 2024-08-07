import React from 'react';
import { Button } from './ui/button';

type ChipProps = {
  label: string;
};

export default function Chip({ label, ...props }: ChipProps) {
  return <Button {...{ props }}>{label}</Button>;
}
