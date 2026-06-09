import { Router } from 'express';
import { EvidenciaControlador } from '../controladores/evidencia.controlador';

export const evidenciaRutas = Router();

evidenciaRutas.get('/', EvidenciaControlador.listar);
evidenciaRutas.get('/:id', EvidenciaControlador.obtener);
evidenciaRutas.post('/', EvidenciaControlador.crear);
evidenciaRutas.delete('/:id', EvidenciaControlador.eliminar);
