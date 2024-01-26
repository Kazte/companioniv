import { open, OpenDialogOptions } from '@tauri-apps/api/dialog';

export async function openFile(
  options?: OpenDialogOptions
): Promise<string | null> {
  const selectedPath = (await open({
    multiple: false,
    ...options
  })) as string;
  return selectedPath;
}

export async function openFiles(
  options?: OpenDialogOptions
): Promise<string[] | null> {
  const selectedPaths = (await open({
    multiple: true,
    ...options
  })) as string[];
  return selectedPaths;
}

export const OPEN_DIALOG_BUILD_OPTIONS: OpenDialogOptions = {
  multiple: false,
  filters: [
    {
      name: 'Json',
      extensions: ['json']
    }
  ]
};
