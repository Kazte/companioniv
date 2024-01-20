import {
  Menubar as Menu,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger
} from '../ui/menubar';
import {Minus, X} from 'lucide-react';
import {Button} from '@/components/ui/button.tsx';
import {appWindow} from '@tauri-apps/api/window';


export default function Menubar() {

  const handleOnMinize = () => {
    appWindow.minimize();
  };

  const handleOnClose = () => {
    appWindow.close();
  };

  return (
    <Menu className="rounded-none border-b border-divider px-2 lg:px-4 justify-between h-[35px]" data-tauri-drag-region>
      <div className='flex flex-row gap-4'>
        <MenubarMenu>
          <MenubarTrigger className="text-sm h-1/2 hover:bg-accent transition-opacity data-[state=open]:bg-transparent data-[highlighted]:bg-transparent">CompanionIV</MenubarTrigger>

          <MenubarContent>
            <MenubarItem>About CompanionIV</MenubarItem>
            <MenubarSeparator/>
            <MenubarItem>
              Open
            </MenubarItem>
            <MenubarItem>
              Hide
            </MenubarItem>
            <MenubarSeparator/>
            <MenubarItem>
              Preferences
            </MenubarItem>
            <MenubarSeparator/>
            <MenubarItem onClick={handleOnClose}>
              Quit
            </MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </div>
      <div className='flex flex-row gap-2 '>
        {/*<ModeToggle/>*/}
        <Button variant="ghost" className='h-1/2 w-1/2' size="icon" onClick={handleOnMinize}>
          <Minus/>
        </Button>
        <Button variant="ghost" className='h-1/2 w-1/2' size="icon" onClick={handleOnClose}>
          <X/>
        </Button>
      </div>
    </Menu>
  );
}