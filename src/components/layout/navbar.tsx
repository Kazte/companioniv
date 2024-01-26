import {
  Menubar,
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
import { useAppStore } from '@/stores/app.store';
import { OPEN_DIALOG_BUILD_OPTIONS, openFile } from '@/utils/open-file';
import { IDataBuild } from '@/interfaces/data.interface';
import schema from '@/schemas/build.schema';
import { readTextFile } from '@tauri-apps/api/fs';
import Avj from 'ajv';
import { useToast } from '../ui/use-toast';
// import { ModeToggle } from '../mode-toggle';

export default function Navbar() {
  const { toast } = useToast();
  const { setInGameMode, skillTree, setSkillTree, currentStep } = useAppStore(
    (state) => state
  );

  const handleOnMinize = () => {
    appWindow.minimize();
  };

  const handleOnClose = () => {
    appWindow.close();
  };

  const handleOpen = async () => {
    const selectedPath = await openFile(OPEN_DIALOG_BUILD_OPTIONS);

    await setFile(selectedPath);
  };

  const setFile = async (filePath: string | null) => {
    if (filePath) {
      const entry = await readTextFile(filePath);
      const data: IDataBuild = JSON.parse(entry);

      // validate data
      const avj = new Avj();

      const validate = avj.compile(schema);

      const isValid = validate(data);

      if (!isValid) {
        toast({
          title: 'Invalid build',
          description:
            'The build you selected is invalid, maybe it is not a valid build schema.',
          variant: 'destructive'
        });
        return;
      }

      setSkillTree(data);
    } else {
      toast({
        title: 'Invalid path',
        description: 'The path you selected is invalid!',
        variant: 'destructive'
      });
    }
  };

  const handleInGameMode = () => {
    setInGameMode(true);
  };

  return (
    <Menubar
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
            <MenubarItem
              onClick={() => {
                setSkillTree();
              }}
            >
              Close Build
            </MenubarItem>
            <MenubarSeparator />
            <MenubarItem>Preferences</MenubarItem>
            <MenubarSeparator />
            <MenubarItem onClick={handleOnClose}>Quit</MenubarItem>
          </MenubarContent>
        </MenubarMenu>
      </div>
      {skillTree && (
        <div className='pointer-events-none text-center'>
          {skillTree?.meta.build_name} ({currentStep})
        </div>
      )}
      <div className='flex flex-row gap-2 '>
        {/* <ModeToggle /> */}
        <Button
          variant='secondary'
          className='h-1/2 w-1/2'
          size='icon'
          onClick={handleOnMinize}
        >
          <Minus />
        </Button>
        <Button
          variant='destructive'
          className='h-1/2 w-1/2'
          size='icon'
          onClick={handleOnClose}
        >
          <X />
        </Button>
      </div>
    </Menubar>
  );
}
