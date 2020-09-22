import { toBigIntBE } from 'bigint-buffer';
import { Note } from '../note';
import { Signature } from '../signature';
import { BarretenbergWasm } from '../../wasm';

export class NoteAlgorithms {
  constructor(private wasm: BarretenbergWasm) {}

  public encryptNote(note: Note) {
    this.wasm.transferToHeap(note.toBuffer(), 0);
    this.wasm.call('notes__encrypt_note', 0, 100);
    return Buffer.from(this.wasm.sliceMemory(100, 164));
  }

  public decryptNote(encryptedNote: Buffer, privateKey: Buffer, viewingKey: Buffer) {
    this.wasm.transferToHeap(encryptedNote, 0);
    this.wasm.transferToHeap(privateKey, 64);
    this.wasm.transferToHeap(viewingKey, 96);
    const success = this.wasm.call('notes__decrypt_note', 0, 64, 96, 128) ? true : false;
    const value = toBigIntBE(Buffer.from(this.wasm.sliceMemory(128, 160)));
    return { success, value };
  }

  public sign(notes: Note[], pk: Buffer, outputOwner: Buffer) {
    const buf = Buffer.concat(notes.map(n => n.toBuffer()));
    this.wasm.transferToHeap(pk, 0);
    this.wasm.transferToHeap(Buffer.concat([Buffer.alloc(12), outputOwner]), 32);
    this.wasm.transferToHeap(buf, 64);
    this.wasm.call('notes__sign_4_notes', 0, 32, 64);
    const sig = Buffer.from(this.wasm.sliceMemory(0, 64));
    return new Signature(sig.slice(0, 32), sig.slice(32, 64));
  }
}
