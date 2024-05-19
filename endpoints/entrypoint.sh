#!/bin/bash

set -a
source /app/.env
set +a

rm -f /app/.env

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --device) DEVICE="$2"; shift ;;
    esac
    shift
done

if [ -z "$DEVICE" ]; then
    echo "Error: --device argument must be specified (cpu, gpu, mps)"
    exit 1
fi

case $DEVICE in
    cpu) python /app/endpoints/predict_cpu.py ;;
    gpu) python /app/endpoints/predict_gpu.py ;;
    mps) python /app/endpoints/predict_mps.py ;;
    *)
        echo "Error: Unrecognized device. Use cpu, gpu, or mps."
        exit 1
        ;;
esac
