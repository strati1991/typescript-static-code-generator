import {transformerFactory} from '../transformer';
import {constructorTransformer} from './constructor-transformer';
import {methodTransformer} from './method-transformer';

export default transformerFactory([constructorTransformer, methodTransformer]);
