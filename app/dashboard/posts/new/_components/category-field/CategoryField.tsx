import { Label } from '@/components/ui/label';

type CategoryFieldProps = {
  children: React.ReactNode;
};

export default function CategoryField({
  children,
}: CategoryFieldProps) {
  return (
    <div>
      <Label htmlFor="categories" className="text-lg block pb-2">
        Select or Create Categories*
      </Label>
      {children}
    </div>
  );
}
