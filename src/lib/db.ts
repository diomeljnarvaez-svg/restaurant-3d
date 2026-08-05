import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "src", "data");

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

function filePath(name: string) {
  ensureDataDir();
  return path.join(DATA_DIR, `${name}.json`);
}

function read<T>(name: string): T[] {
  const fp = filePath(name);
  if (!fs.existsSync(fp)) return [];
  return JSON.parse(fs.readFileSync(fp, "utf-8"));
}

function write<T>(name: string, data: T[]) {
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2));
}

export function getAll<T>(name: string): T[] {
  return read<T>(name);
}

export function getById<T extends { id: string }>(name: string, id: string): T | null {
  const items = read<T>(name);
  return items.find((i: any) => i.id === id) || null;
}

export function create<T extends { id: string }>(name: string, item: T): T {
  const items = read<T>(name);
  items.push(item);
  write(name, items);
  return item;
}

export function update<T extends { id: string }>(name: string, id: string, updates: Partial<T>): T | null {
  const items = read<T>(name);
  const idx = items.findIndex((i: any) => i.id === id);
  if (idx === -1) return null;
  items[idx] = { ...items[idx], ...updates };
  write(name, items);
  return items[idx];
}

export function remove<T extends { id: string }>(name: string, id: string): boolean {
  const items = read<T>(name);
  const idx = items.findIndex((i: any) => i.id === id);
  if (idx === -1) return false;
  items.splice(idx, 1);
  write(name, items);
  return true;
}

export function getSettings(name: string): Record<string, any> | null {
  const fp = filePath(name);
  if (!fs.existsSync(fp)) return null;
  return JSON.parse(fs.readFileSync(fp, "utf-8"));
}

export function saveSettings(name: string, data: Record<string, any>) {
  ensureDataDir();
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2));
}

export function readData<T>(name: string): T[] {
  return read<T>(name);
}

export function writeData<T>(name: string, data: T[]) {
  write(name, data);
}
