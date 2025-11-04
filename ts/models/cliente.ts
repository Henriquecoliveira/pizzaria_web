// criando a interface para cadastro de novos usuários
export interface Cliente {
  usuario_id?: number; // será preenchdio pelo DB IDENTITY - adicionado aqui só por desencargo de consciência futura
  usuario: string;
  email: string;
  senha: string;
  cpf: string;
  telefone: string;
  rua: string;
  cidade: string;
  bairro: string;
  numero_casa: string;
}
