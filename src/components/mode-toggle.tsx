import {Laptop, Moon, Sun} from 'lucide-react';

import {Button} from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {useTheme} from '@/components/theme-provider';
import {cn} from '@/lib/utils.ts';

export function ModeToggle() {
  const {theme, setTheme} = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' size="icon">
          <Sun
            className={cn('h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all ', theme !== 'light' && 'scale-0 rotate-90')}/>
          <Moon
            className={cn('absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all', theme !== 'dark' && 'scale-0 rotate-90')}/>
          <Laptop
            className={cn('absolute h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all', theme !== 'system' && 'scale-0 rotate-90')}/>
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme('light')}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('dark')}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme('system')}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
