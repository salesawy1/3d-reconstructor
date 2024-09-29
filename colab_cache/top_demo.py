import os
import torch
import shutil
import tempfile
import gradio as gr
from pyngrok import ngrok
from dust3r.model import AsymmetricCroCo3DStereo
from dust3r.demo import get_args_parser, batch_generate, set_print_with_timestamp, extract_frames
import matplotlib.pyplot as pl
pl.ion()
torch.backends.cuda.matmul.allow_tf32 = True

import trimesh

def convert_glb_to_obj(glb_path, obj_path):
  # Load the .glb file
  mesh = trimesh.load(glb_path)

  # Export the mesh to .obj format
  mesh.export(obj_path)    

if __name__ == '__main__':
    parser = get_args_parser()
    args = parser.parse_args()
    set_print_with_timestamp()
    if args.tmp_dir is not None:
        tmp_path = args.tmp_dir
        os.makedirs(tmp_path, exist_ok=True)
        tempfile.tempdir = tmp_path
    if args.server_name is not None:
        server_name = args.server_name
    else:
        server_name = '0.0.0.0' if args.local_network else '127.0.0.1'
    if args.weights is not None:
        weights_path = args.weights
    else:
        weights_path = "naver/" + args.model_name
    model = AsymmetricCroCo3DStereo.from_pretrained(weights_path).to(args.device)
    # dust3r will write the 3D model inside tmpdirname
    with tempfile.TemporaryDirectory(suffix='dust3r_gradio_demo') as tmpdirname:        
        if not args.silent:
            print('Outputing stuff in', tmpdirname)
        # Expose Gradio demo with ngrok
        # public_url = ngrok.connect(7860)  # Assuming Gradio runs on port 7860
        # print(f"Public URL: {public_url}")
        # Usage
        output_directory = "/content/data/temp/"

        if os.path.exists(output_directory) and os.path.isdir(output_directory):
          shutil.rmtree(output_directory)
          print(f"Removed directory and contents: {output_directory}")
        else:
          print(f"Directory does not exist: {output_directory}")

        extract_frames(args.video_in, output_directory)
        for root, dirs, files in os.walk(output_directory):
          for dir_name in dirs:
            frame_name = os.path.join(root, dir_name)            
            output_dir = batch_generate(tmpdirname, model, args.device, args.image_size, server_name, args.server_port, frame_name, silent=args.silent)
            glb_file = os.path.join(output_dir, "scene.glb")
            shutil.copy(glb_file, frame_name)
          break  # Only process the top-level directories
          
        for root, dirs, files in os.walk(output_directory):
          for dir_name in dirs:
            frame_name = os.path.join(root, dir_name)
            shutil.copy(os.path.join(frame_name, "scene.glb"), os.path.join(args.video_in, f"{dir_name}.glb"))
        
        