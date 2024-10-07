
import express from 'express';
import { compileCode } from '../controllers/editor.controller';

export const editorRouter = express();

editorRouter.post("/compile", compileCode)  