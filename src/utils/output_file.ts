import fsExtra from 'fs-extra';
import { logErr } from './logger';

export function output_file ({
  file_path,
  file_content
}: {
  file_path: string;
  file_content: string | false;
}) {
  try {
    if (file_path && file_content && typeof file_path === 'string' && typeof file_content === 'string') {
      fsExtra.outputFileSync(file_path, file_content, 'utf8');
    }
  } catch (err) {
    logErr(err);
  }
}

export default output_file;