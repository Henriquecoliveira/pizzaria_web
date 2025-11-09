// criando a interface para cadastro de novos usuários
export interface Cliente {
  usuario: string;
  email: string;
  senha: string;
  cpf: string;
  telefone: string;
}

// linha do usuarioID removida, pois é uma função do SQL criar esse identificado a cada linha, entendo eu - Henrique