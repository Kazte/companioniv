import { useEffect, useRef } from 'react';
import { Button } from './components/ui/button';
import Navbar from '@/components/layout/navbar';
import SkillTreePoint from '@/components/skill-tree-point.tsx';
import { ExternalLink, Plus } from 'lucide-react';
import {
  isRegistered,
  register,
  unregister
} from '@tauri-apps/api/globalShortcut';
import { readTextFile } from '@tauri-apps/api/fs';
import { appWindow, LogicalSize } from '@tauri-apps/api/window';
import useMinMaxValue from '@/hooks/useMinMaxValue.ts';
import { useAppStore } from './stores/app.store';
import { Each } from './lib/each';
import { cn } from './lib/utils';
import { Switch, Case, Default } from 'ktools-r';
import { IDataBuild } from './interfaces/data.interface';
import Avj from 'ajv';
import schema from './schemas/build.schema';
import { useToast } from './components/ui/use-toast';
import { openFile, OPEN_DIALOG_BUILD_OPTIONS } from './utils/open-file';
import { Command } from './components/ui/command';
import { Badge } from './components/ui/badge';

function App() {
  const listRef = useRef(null);
  const { toast } = useToast();
  const inGameMode = useAppStore((state) => state.inGameMode);
  const setInGameMode = useAppStore((state) => state.setInGameMode);
  const { skillTree, setSkillTree, setCurrentStep } = useAppStore(
    (state) => state
  );
  const { value: currentPoint, setValue: setCurrentPoint } = useMinMaxValue({
    startValue: 1,
    maxValue:
      skillTree?.meta.max !== undefined ? skillTree.meta.max : Number.MAX_VALUE,
    minValue: 1,
    onChange: (value) => {
      setCurrentStep(value);
    }
  });

  useEffect(() => {
    // fetch('/mock/data.json')
    //   .then((res) => res.json())
    //   .then(setSkillTree);

    isRegistered('Shift+CommandOrControl+PageDown').then((isRegistered) => {
      if (!isRegistered) {
        register('Shift+CommandOrControl+PageDown', () => {
          setCurrentPoint((prevState) => prevState + 1);
        }).catch((error) => {
          console.error('Failed to register global shortcut', error);
        });
      }
    });

    isRegistered('Shift+CommandOrControl+PageUp').then((isRegistered) => {
      if (!isRegistered) {
        register('Shift+CommandOrControl+PageUp', () => {
          setCurrentPoint((prevState) => prevState - 1);
        }).catch((error) => {
          console.error('Failed to register global shortcut', error);
        });
      }
    });

    isRegistered('Shift+CommandOrControl+Home').then((isRegistered) => {
      if (!isRegistered) {
        register('Shift+CommandOrControl+Home', () => {
          setInGameMode(true);
        }).catch((error) => {
          console.error('Failed to register global shortcut', error);
        });
      }
    });

    isRegistered('Shift+CommandOrControl+End').then((isRegistered) => {
      if (!isRegistered) {
        register('Shift+CommandOrControl+End', () => {
          setInGameMode(false);
        }).catch((error) => {
          console.error('Failed to register global shortcut', error);
        });
      }
    });

    return () => {
      // Unbind to prevent multiple subscription to the event
      unregister('Shift+CommandOrControl+PageDown').catch((error) => {
        console.error('Failed to unregister global shortcut', error);
      });
      unregister('Shift+CommandOrControl+PageUp').catch((error) => {
        console.error('Failed to unregister global shortcut', error);
      });
      unregister('Shift+CommandOrControl+Home').catch((error) => {
        console.error('Failed to unregister global shortcut', error);
      });
      unregister('Shift+CommandOrControl+End').catch((error) => {
        console.error('Failed to unregister global shortcut', error);
      });
    };
  }, []);

  useEffect(() => {
    if (inGameMode) {
      //270 x 400
      appWindow.setSize(new LogicalSize(270, 400));
      appWindow.setAlwaysOnTop(true);
      appWindow.setIgnoreCursorEvents(true);
    } else {
      appWindow.setSize(new LogicalSize(800, 600));
      appWindow.setAlwaysOnTop(false);
      appWindow.setIgnoreCursorEvents(false);
    }
  }, [inGameMode]);

  useEffect(() => {
    if (listRef.current) {
      const scrollToElement = (listRef.current as HTMLElement).children[
        currentPoint - 1
      ];

      if (scrollToElement) {
        scrollToElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
          inline: 'nearest'
        });
      }
    }
  }, [currentPoint]);

  const handlePointClick = (order: number) => {
    setCurrentPoint(order);
  };

  useEffect(() => {
    if (inGameMode) {
      document.body.classList.add('bg-background/70');
    } else {
      document.body.classList.remove('bg-background/70');
    }
  }, [inGameMode]);

  const handleOnClickDropzone = async (
    e: React.MouseEvent<HTMLLabelElement>
  ) => {
    e.preventDefault();

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

  return (
    <section className={cn('h-screen flex flex-col items-stretch')}>
      {!inGameMode && <Navbar />}
      <Switch>
        <Case condition={!skillTree}>
          <Switch>
            <Case condition={!!inGameMode}>
              <section className='flex-1 grid place-items-center w-full h-full gap-6 overflow-hidden px-5 border-red-600 border-4'>
                <div
                  className={`flex flex-col gap-4 text-center ${
                    inGameMode ? 'overflow-hidden' : 'overflow-y-auto'
                  }`}
                  ref={listRef}
                >
                  <p className='text-3xl font-semibold'>POSITION TEST</p>
                  <div className='flex flex-col justify-center items-center gap-1'>
                    <p className='text-xl'>Press</p>
                    <Badge>Shift+Control+End</Badge>
                    <p>
                      to <span className='font-semibold'>Return</span>
                    </p>
                  </div>
                </div>
              </section>
            </Case>
            <Default>
              <section className='flex-1 w-full h-full'>
                <div className='flex items-center justify-center w-full h-full p-32'>
                  <label
                    htmlFor='dropzone-file'
                    onClick={handleOnClickDropzone}
                    className='flex flex-col items-center justify-center w-full h-full border-2 border-accent-foreground/50 border-dashed rounded-lg cursor-pointer bg-background/150 hover:border-accent-foreground'
                  >
                    <div className='flex flex-col gap-4 items-center justify-center pt-5 pb-6'>
                      <Plus className='h-12 w-12 text-accent-foreground' />
                      <p className='mb-2 text-md text-gray-500'>
                        <span className='font-semibold'>
                          Click to upload a new build
                        </span>
                      </p>
                    </div>
                    <input id='dropzone-file' type='file' className='hidden' />
                  </label>
                </div>
              </section>
            </Default>
          </Switch>
        </Case>

        <Default>
          <section className='flex-1 flex flex-col gap-6 overflow-hidden px-5'>
            {!inGameMode && (
              <>
                <div className='flex flex-col gap-2'>
                  <h1 className='text-5xl'>{skillTree?.meta.build_name}</h1>
                  <em>by {skillTree?.meta.creator}</em>
                </div>
                <section>
                  <Button asChild>
                    <a
                      href={skillTree?.meta.url}
                      target='_blank'
                      rel='noreferrer'
                    >
                      Open Build <ExternalLink className='ml-2 h-4 w-4' />
                    </a>
                  </Button>
                </section>

                <p>Skill Tree</p>
              </>
            )}

            <div
              className={`flex flex-col gap-4 ${
                inGameMode ? 'overflow-hidden' : 'overflow-y-auto'
              }`}
              ref={listRef}
            >
              <Each
                of={skillTree?.data.skill_tree || []}
                render={(point) => (
                  <SkillTreePoint
                    key={point.order}
                    data={point}
                    selected={currentPoint === point.order}
                    onClick={handlePointClick}
                  />
                )}
              />
            </div>
          </section>
        </Default>
      </Switch>
    </section>
  );
}

export default App;
