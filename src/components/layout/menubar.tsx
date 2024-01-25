import {
  Menubar as Menu,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger
} from '../ui/menubar';
import { Minus, X } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { appWindow } from '@tauri-apps/api/window';
import { open } from '@tauri-apps/api/dialog';
import { useAppStore } from '@/stores/app.store';

export default function Menubar() {
  const { setInGameMode } = useAppStore((state) => state);

  const handleOnMinize = () => {
    appWindow.minimize();
  };

  const handleOnClose = () => {
    appWindow.close();
  };

  const handleOpen = async () => {
    const selected = await open({
      multiple: true,
      filters: [
        {
          name: 'Image',
          extensions: ['png', 'jpeg']
        }
      ]
    });
    if (Array.isArray(selected)) {
      console.log('user selected', selected);
    } else if (selected === null) {
      console.log('user cancelled');
    } else {
      console.log('failed to open dialog');
    }
  };

  const handleInGameMode = () => {
    setInGameMode(true);
  };

  return (
    <Menu
      className='rounded-none border-b border-divider px-2 lg:px-4 justify-between h-[35px]'
      data-tauri-drag-region
    >
      <div className='flex flex-row gap-4'>
        <MenubarMenu>
          <MenubarTrigger className='text-sm h-1/2 hover:bg-accent transition-opacity data-[state=open]:bg-transparent data-[highlighted]:bg-transparent'>
            CompanionIV
          </MenubarTrigger>

          <MenubarContent>
            <MenubarItem asChild>
              <a
                href='https://github.com/Kazte/diabloiv-companion'
                target='_blank'
                rel='noreferrer'
              >
                About CompanionIV
              </a>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={handleOpen}>Open</MenubarItem>
            <MenubarSeparator />
            <MenubarItem>
              Back<MenubarShortcut>⌘PgDn</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              Next<MenubarShortcut>⌘PgUp</MenubarShortcut>
            </MenubarItem>
            <MenubarItem onClick={handleInGameMode}>
              In Game Mode<MenubarShortcut>⇧⌘Home</MenubarShortcut>
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Preferences</MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={handleOnClose}>Quit</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </div>
      <div className='flex flex-row gap-2 '>
        {/*<ModeToggle/>*/}
        <Button
          variant='ghost'
          className='h-1/2 w-1/2'
          size='icon'
          onClick={handleOnMinize}
        >
          <Minus />
        </Button>
        <Button
          variant='ghost'
          className='h-1/2 w-1/2'
          size='icon'
          onClick={handleOnClose}
        >
          <X />
        </Button>
      </div>
    </Menu>
  );
}
