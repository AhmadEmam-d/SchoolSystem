#!/usr/bin/env python3
import os
import shutil
from pathlib import Path

# Base directory
src_dir = Path('/tmp/sandbox/src/app')

# Find all .tsx and .ts files (excluding protected ones)
exclude_patterns = ['ImageWithFallback.tsx', 'App.tsx', 'node_modules']

def should_exclude(filepath):
    return any(pattern in str(filepath) for pattern in exclude_patterns)

def convert_file(tsx_path):
    """Copy .tsx to .jsx and .ts to .js"""
    if tsx_path.suffix == '.tsx':
        jsx_path = tsx_path.with_suffix('.jsx')
    elif tsx_path.suffix == '.ts':
        jsx_path = tsx_path.with_suffix('.js')
    else:
        return None
    
    # Copy file content
    shutil.copy2(tsx_path, jsx_path)
    return jsx_path

# Find and convert all TypeScript files
converted_files = []
for tsx_file in src_dir.rglob('*.tsx'):
    if not should_exclude(tsx_file):
        result = convert_file(tsx_file)
        if result:
            converted_files.append(str(result))
            print(f"Converted: {tsx_file.name} -> {result.name}")

for ts_file in src_dir.rglob('*.ts'):
    if not should_exclude(ts_file):
        result = convert_file(ts_file)
        if result:
            converted_files.append(str(result))
            print(f"Converted: {ts_file.name} -> {result.name}")

print(f"\nTotal files converted: {len(converted_files)}")
