import { navList } from '../const';
import MenuNav from '@/components/navigation/MenuNav';
import NavItem from '@/components/navigation/NavItem';

export default function DashBoardNav() {
  return (
    <MenuNav items={navList} ItemComp={NavItem} className="px-4" />
  );
}
