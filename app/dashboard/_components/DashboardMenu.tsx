'use client';
import MenuItem from '@/components/navigation/MenuItem';
import { navList } from '../const';
import MenuNav from '@/components/navigation/MenuNav';

export default function DashboardMenu() {
  return <MenuNav items={navList} ItemComp={MenuItem} />;
}
