#!/usr/bin/env python3
import os
import json
import sys
import argparse

def generar_lista_imagenes(carpeta):
    """
    Lee todos los archivos dentro de la carpeta indicada y devuelve
    un array JSON con sus rutas relativas (utilizando "/" como separador).
    """
    try:
        nombres = os.listdir(carpeta)
    except FileNotFoundError:
        print(f"Error: La carpeta '{carpeta}' no existe.", file=sys.stderr)
        sys.exit(1)
    except PermissionError:
        print(f"Error: Sin permisos para leer '{carpeta}'.", file=sys.stderr)
        sys.exit(1)

    # Filtrar solo archivos, no subcarpetas
    archivos = [fn for fn in nombres if os.path.isfile(os.path.join(carpeta, fn))]
    # Construir rutas relativas (por ejemplo: "images/desfile-2025/archivo.jpg")
    rutas = [os.path.join(carpeta, fn).replace("\\", "/") for fn in archivos]
    return rutas

def main():
    parser = argparse.ArgumentParser(
        description="Genera un array JSON con las rutas de todas las imágenes en una carpeta dada."
    )
    parser.add_argument(
        "carpeta",
        help="Ruta relativa (desde la ubicación del script) a la carpeta de imágenes. Ejemplo: images/desfile-2025"
    )
    args = parser.parse_args()

    rutas = generar_lista_imagenes(args.carpeta)
    # Imprimir el array JSON formateado para copiar directamente en news.json
    print(json.dumps(rutas, indent=2, ensure_ascii=False))

if __name__ == "__main__":
    main()