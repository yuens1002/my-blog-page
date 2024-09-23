import cn from '@/lib/cn';
import Icon, { IconProps } from '@/components/Icon';

type ListItemProps = {
  icon: IconProps;
  linkIsCurrent?: boolean;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<'li'>;

export default function ListItem({
  icon,
  linkIsCurrent,
  children,
  className,
}: ListItemProps) {
  console.log('🚀 ~ children:', children);

  return (
    <li
      className={cn(
        'flex items-center px-2 py-4 gap-x-2 rounded-sm',
        className,
        linkIsCurrent && 'bg-primary/10'
      )}
    >
      <Icon name={icon.name} {...{ icon }} />
      <span
        className={cn('capitalize', linkIsCurrent && 'font-bold')}
      >
        {children}
      </span>
    </li>
  );
}
