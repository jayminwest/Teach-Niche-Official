from pydantic import BaseModel
from typing import Optional, List, Literal
from pathlib import Path
from aider.coders import Coder
from aider.models import Model
from aider.io import InputOutput
import yaml
import argparse
from openai import OpenAI
import os


class CleanupConfig(BaseModel):
    prompt: str
    coder_model: str = "deepseek/deepseek-chat"  # Set default model
    evaluator_model: Literal["gpt-4o", "gpt-4o-mini", "o1-mini", "o1-preview", "deepseek/deepseek-chat"]
    max_iterations: int
    context_editable: List[str]
    context_read_only: List[str]


class CleanupProject:
    """
    Project Cleanup Assistant
    """

    def __init__(self, config_path: str):
        self.config = self.validate_config(Path(config_path))
        self.llm_client = OpenAI()

    @staticmethod
    def validate_config(config_path: Path) -> CleanupConfig:
        """Validate the yaml config file and return CleanupConfig object."""
        if not config_path.exists():
            raise FileNotFoundError(f"Config file not found: {config_path}")

        with open(config_path) as f:
            config_dict = yaml.safe_load(f)

        # If prompt ends with .md, read content from that file
        if config_dict["prompt"].endswith(".md"):
            prompt_path = Path(config_dict["prompt"])
            if not prompt_path.exists():
                raise FileNotFoundError(f"Prompt file not found: {prompt_path}")
            with open(prompt_path) as f:
                config_dict["prompt"] = f.read()

        config = CleanupConfig(**config_dict)

        # Validate evaluator_model is one of the allowed values
        allowed_evaluator_models = {"gpt-4o", "gpt-4o-mini", "o1-mini", "o1-preview", "deepseek/deepseek-chat"}
        if config.evaluator_model not in allowed_evaluator_models:
            raise ValueError(
                f"evaluator_model must be one of {allowed_evaluator_models}, "
                f"got {config.evaluator_model}"
            )

        # Validate we have at least 1 editable file
        if not config.context_editable:
            raise ValueError("At least one editable context file must be specified")

        # Validate all paths in context_editable and context_read_only exist
        for path in config.context_editable:
            if not Path(path).exists():
                raise FileNotFoundError(f"Editable context file not found: {path}")

        for path in config.context_read_only:
            if not Path(path).exists():
                raise FileNotFoundError(f"Read-only context file not found: {path}")

        return config

    def file_log(self, message: str, print_message: bool = True):
        if print_message:
            print(message)
        with open("cleanup_log.txt", "a+") as f:
            f.write(message + "\n")

    def cleanup_folder(self, folder_path: str):
        """Recursively process all Python files in folder and subfolders"""
        self.file_log(f"\n📂 Processing folder: {folder_path}")
        
        # Walk through all directories and subdirectories
        for root, dirs, files in os.walk(folder_path):
            # Process each Python file
            for file in files:
                if file.endswith('.py'):
                    file_path = os.path.join(root, file)
                    self.file_log(f"📄 Found Python file: {file_path}")
                    
                    # Get user confirmation before processing each file
                    confirm = input(f"Process {file_path}? (y/n): ").lower()
                    if confirm != 'y':
                        self.file_log(f"Skipping {file_path}")
                        continue
                        
                    # Process file with AIDER
                    self.process_file(file_path)

    def process_file(self, file_path: str):
        """Process a single file using AIDER"""
        model = Model(self.config.coder_model)
        coder = Coder.create(
            main_model=model,
            io=InputOutput(yes=True),
            fnames=[file_path],
            read_only_fnames=self.config.context_read_only,
            auto_commits=False,
            suggest_shell_commands=False,
        )
        
        # Use the same cleanup prompt for all files
        coder.run(self.config.prompt)

    def cleanup(self):
        """Main cleanup loop"""
        for folder in self.config.context_editable:
            if os.path.isdir(folder):
                # Add directory confirmation
                confirm = input(f"\n📂 Process directory {folder} and all subdirectories? (y/n): ").lower()
                if confirm != 'y':
                    self.file_log(f"Skipping directory {folder}")
                    continue
                    
                self.cleanup_folder(folder)
            else:
                self.file_log(f"{folder} is not a directory, skipping")

        self.file_log("\n✅ Cleanup complete")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description="Run the Project Cleanup Assistant with a config file"
    )
    parser.add_argument(
        "--config",
        type=str,
        default="specs/cleanup.yaml",
        help="Path to the YAML config file",
    )
    args = parser.parse_args()
    cleaner = CleanupProject(args.config)
    cleaner.cleanup()
