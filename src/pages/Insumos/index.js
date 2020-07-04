import React, { useState, useEffect } from 'react';
import { FaSignOutAlt, FaEdit, FaPlus } from 'react-icons/fa';
import  { useHistory, Link } from 'react-router-dom';
import './style.css';
import api from '../../services/api';

export default function Insumos(){
  const history = useHistory();
  const [category, setCategory] = useState("");
  const [nameInsumo, setNameInsumo] = useState("");
  const [insumos, setInsumo] = useState([]);
  const [datacategory, setDataCategory] = useState([]);
  const [dataSubCategory, setDataSubCategory] = useState([]);
  const [subCategory, setSubCategory] = useState("");
  const [quantidade, setQuantidade] = useState("");
  const [custo, setCusto] = useState("");
  const [minimo, setMinimo] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedInsumo, setSelectedInsumo] = useState("");
  const [selectSubCategory, setSelectSubCategory] = useState("");
  const userId = localStorage.getItem('id');
  useEffect(() => {
    api.get('insumos').then(response => 
            setInsumo(response.data)
        )
  }, []);
  useEffect(() => {
    api.get('categories').then(response => 
         setDataCategory(response.data)
        )
  }, []);

  function handleLogout(e) {
      e.preventDefault();
      localStorage.clear();
      history.push('/');
  }
  async function cadastrarCategoria(e){
      e.preventDefault();
    try{
        const response = await api.post('categories', {
        name: category,
        });
        alert(`A Categoria ${response.data.name} foi cadastrada com sucesso`);
        setDataCategory(datacategory => [...datacategory, response.data]);
    }catch(error){
        alert(error)
    }
      
  }
  async function selecionarSubCategoria(e, categoria){
    e.preventDefault();
    let categoryId;
    datacategory.map(category => {
        if (category.name === categoria){
            categoryId = category.id;
        }
    })
    await api.get(`subcategories/${categoryId}`).then(response => 
        setDataSubCategory(response.data)
    );
  }
  async function cadastrarSubCategoria(e){
      e.preventDefault();
      if (selectedCategory == ''){
          return alert('Por favor selecione uma categoria');
      }
      let categoryId;
      datacategory.map(category => {
          if (category.name === selectedCategory){
              categoryId = category.id;
          }
        })
    try{
        const response = await api.post('subcategories', {
            category: categoryId,
            name: subCategory,
        });
        alert(`A Sub Categoria ${response.data.name} foi cadastrada com sucesso`);
        setDataSubCategory(dataSubCategory => [...dataSubCategory, response.data]);
    }catch(error){
        alert(error)
    }
  }
  async function cadastrarInsumo(e){    
    e.preventDefault();

    if (selectedCategory == ''){
        return alert('Por favor selecione uma categoria');
    }
    let subCategoryId;
    let categoryId;
    datacategory.map(category => {
        if (category.name === selectedCategory){
            categoryId = category.id;
        }
    });
    dataSubCategory.map(subCategory => {
        if (subCategory.name === selectSubCategory){
            subCategoryId = subCategory.id;
        }
    });
  try{
      const response = await api.post('insumos', {
          category: categoryId,
          sub_category: subCategoryId,
          name: nameInsumo,
          quantidade: quantidade,
          minimo: minimo,
          by_user: userId
      });
      alert(`O insumo ${response.data.name} foi cadastrado com sucesso`);
      setInsumo(insumos => [...insumos, response.data]);
  }catch(error){
      alert(JSON.stringify(error));
  }
  }
  async function saida(e){
      e.preventDefault();
      let insumoId;
      insumos.map(insumo => {
          if (insumo.name === selectedInsumo){
              insumoId = insumo.id;
          }
      });
      try{
          const response = await api.post('saidas', {
            insumo: insumoId,
            quantidade: quantidade,
            by_user: userId
            });
        
        alert(`Retirada concluída com sucesso!`);
        window.location.reload(false);
    }catch(error){
        alert(error)
    }
  }
  async function compra(e){
      e.preventDefault();
      let insumoId;
      insumos.map(insumo => {
          if (insumo.name === selectedInsumo){
              insumoId = insumo.id;
          }
      });
      try{
          await api.post('compras', {
            insumo: insumoId,
            custo: custo,
            quantidade: quantidade
            });
        
        alert(`A entrada foi concluída com sucesso!`);
        window.location.reload(false);
    }catch(error){
        alert(error)
    }
  }

  return (
    <div className="container-fluid">
      <nav className="navbar navbar-light fixed-top" role="navigation" style={{background: "#fff"}}>
          <button className="navbar-toggler" onClick={() => alert('Ainda em desenvolvimento')} type="button" data-toggle="collapse" aria-controls="navbarToggleExternalContent" aria-expanded="false" aria-label="Toggle navigation">
              <span className="navbar-toggler-icon"></span>
          </button>
          <Link className="navbar-brand">
              <img
                  style={{height: "40px", width: "100px"}}
                  alt="logo-castelinho"
                  src={require("../../assets/g10.svg")}
              />
          </Link>
          <Link onClick={handleLogout}>
            <FaSignOutAlt size={30} className="text-danger"/>
          </Link>

      </nav>
      <main>
          <div className="">
              {insumos.map(isumo => {
                  return (
                      <div key={isumo.id} className="card col-12 col-sm-6 col-md-4 mt-1" style={{height: "60px", lineHeight: "6.25px"}}>
                          <div className="card-body d-inline-flex justify-content-between">
                              <h5 className="card-title">{isumo.name}</h5>
                              <h5>{isumo.quantidade}</h5>
                              <Link 
                                  data-toggle="modal" 
                                  data-target=".modal-edicao" 
                              >
                                  <FaEdit size={20} color={"#00f"} />
                              </Link>
                          </div>
                      </div>
                  )
              })}
          </div>
              
      </main>
      <Link className="btn-group dropup">
          <FaPlus 
              size={40} 
              color={"#fff"} 
              className="add dropdown-toggle" 
              data-toggle="dropdown"  
              aria-haspopup={true} 
              aria-expanded={true}
          />
          <div className="dropdown-menu  menu-add" x-placement="bottom-start" >
              <Link 
                  className="dropdown-item"
                  data-toggle="modal" 
                  data-target=".modal-categoria" 
              >Cadastrar Categoria</Link>
              <Link 
                  className="dropdown-item"
                  data-toggle="modal" 
                  data-target=".modal-subcategoria" 
              >Cadastrar Sub Categoria</Link>
              <Link 
                  className="dropdown-item"
                  data-toggle="modal" 
                  data-target=".modal-insumo" 
              >Cadastrar Insumo</Link>
              <div className="dropdown-divider"></div>
              <Link 
                  className="dropdown-item"
                  data-toggle="modal" 
                  data-target=".modal-saida-insumo" 
              >Saídas</Link>
              <Link 
                  className="dropdown-item"
                  data-toggle="modal" 
                  data-target=".modal-compra-insumo" 
              >Compras</Link>
          </div>
      </Link>
      {/* Modal edição de produto */}
      <div className="modal fade modal-edicao" tabIndex="-1" role="dialog" aria-labelledby="myExtraLargeModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
              <div className="modal-content text-center">
                  <h1 className="display-3">Em breve</h1>
                  <p>Você poderá editar o produto aqui</p>
                  <div className="modal-footer">
                      <button 
                          type="button" 
                          className="btn btn-secondary" 
                          data-dismiss="modal"
                      >Fechar</button>
                      <button 
                          type="button" 
                          className="btn btn-primary"
                      >Salvar mudanças</button>
                  </div>
              </div>
          </div>
      </div>
      {/* Modal cadastro de categoria */}
      <div className="modal fade modal-categoria" tabIndex="-1" role="dialog" aria-labelledby="myExtraLargeModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
              <div className="modal-content">
              <div className="modal-header">
                  <h5 className="modal-title">Cadastrar Categoria</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                  </button>
              </div>
              <div className="modal-body">
                  <form>
                      <div className="form-group">
                          <label htmlFor="nameOfCategory">Nome</label>
                          <input 
                              type="text" 
                              className="form-control" 
                              id="nameOfCategory" 
                              value={category}
                              onChange={e => setCategory(e.target.value)} 
                              aria-describedby="categoryHelp" 
                              placeholder="Digite o nome da categoria"
                          />
                          <small id="categoryHelp" className="form-text text-muted">O nome da categoria deve ser único</small>
                      </div>
                  </form>

              </div>
              <div className="modal-footer">
                      <button 
                          type="button" 
                          className="btn btn-secondary" 
                          data-dismiss="modal"
                      >Fechar</button>
                      <button 
                          type="button" 
                          className="btn btn-primary"
                          onClick={cadastrarCategoria}
                      >Salvar alterações</button>
                  </div>
              </div>
          </div>
      </div>     
      {/* Modal cadastro de sub categoria */}
      <div className="modal fade modal-subcategoria" tabIndex="-1" role="dialog" aria-labelledby="myExtraLargeModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
              <div className="modal-content">
              <div className="modal-header">
                  <h5 className="modal-title">Cadastrar Sub Categoria</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                  </button>
              </div>
              <div className="modal-body">
                  <form>
                      <div className="form-group">
                          <label htmlFor="exampleFormControlSelect1">Selecione a Categoria</label>
                          <select value={selectedCategory} onChange={e => {
                              setSelectedCategory(e.target.value);
                            }} 
                            className="form-control" id="exampleFormControlSelect1"
                          >
                              <option>/** Categoria **\</option>
                              {datacategory.map(categoria => {
                                  return (
                                      <option key={categoria.id}>{categoria.name}</option>
                                  )   
                              })}
                          </select>
                      </div>
                      
                      <div className="form-group">
                          <label htmlFor="nameOfCategory">Nome</label>
                          <input 
                              type="text" 
                              className="form-control" 
                              id="nameOfCategory" 
                              value={subCategory}
                              onChange={e => setSubCategory(e.target.value)} 
                              aria-describedby="categoryHelp" 
                              placeholder="Digite o nome da sub categoria"
                          />
                          <small id="categoryHelp" className="form-text text-muted">O nome da sub categoria deve ser único</small>
                      </div>
                  </form>

              </div>
              <div className="modal-footer">
                      <button 
                          type="button" 
                          className="btn btn-secondary" 
                          data-dismiss="modal"
                      >Fechar</button>
                      <button 
                          type="submit" 
                          className="btn btn-primary"
                          onClick={cadastrarSubCategoria}
                      >Salvar alterações</button>
                  </div>
              </div>
          </div>
      </div>       
      {/* Modal cadastro de insumo */}
      <div className="modal fade modal-insumo" tabIndex="-1" role="dialog" aria-labelledby="myExtraLargeModalLabel" aria-hidden="true">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Cadastrar Insumo</h5>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <form>
              <div className="form-group">
                <label htmlFor="exampleFormControlSelect1">Selecione a Categoria</label>
                <select value={selectedCategory} onChange={e => {
                        selecionarSubCategoria(e, e.target.value);
                        setSelectedCategory(e.target.value);
                    }} 
                    className="form-control" id="exampleFormControlSelect1"
                    >
                        <option>/** Categoria **\</option>
                        {datacategory.map(categoria => {
                            return (
                                <option key={categoria.id}>{categoria.name}</option>
                            )   
                        })}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="exampleFormControlSelect1">Selecione a Sub Categoria</label>
                <select value={selectSubCategory} onChange={e => setSelectSubCategory(e.target.value)} 
                className="form-control" id="exampleFormControlSelect1"
                >
                    <option>/** Sub Categoria **\</option>
                    {dataSubCategory.map(subCategoria => {
                        return (
                            <option key={subCategoria.id}>{subCategoria.name}</option>
                        )   
                    })}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="nameOfCategory">Nome</label>
                <input 
                    type="text" 
                    className="form-control" 
                    id="nameOfCategory" 
                    value={nameInsumo}
                    onChange={e => setNameInsumo(e.target.value)} 
                    aria-describedby="categoryHelp" 
                    placeholder="Digite o nome do insumo"
                />
                <small id="categoryHelp" className="form-text text-muted">O nome do insumo deve ser único</small>
              </div>
              <div className="form-group">
                <label htmlFor="quantidade">Quantidade</label>
                <input 
                    type="text" 
                    className="form-control" 
                    id="quantidade" 
                    value={quantidade}
                    onChange={e => setQuantidade(e.target.value)} 
                    aria-describedby="quantidadeHelp" 
                    placeholder="Digite a quantidade"
                />
                <small id="quantidadeHelp" className="form-text text-muted">As casas decimais devem ser escritas com ponto</small>
              </div>
              <div className="form-group">
                <label htmlFor="minimo">Quantidade mínima</label>
                <input 
                    type="text" 
                    className="form-control" 
                    id="minimo" 
                    value={minimo}
                    onChange={e => setMinimo(e.target.value)} 
                    aria-describedby="minimoHelp" 
                    placeholder="Digite a quantidade mínima"
                />
                <small id="minimoHelp" className="form-text text-muted">As casas decimais devem ser escritas com ponto</small>
              </div>
            </form>

          </div>
          <div className="modal-footer">
                <button 
                    type="button" 
                    className="btn btn-secondary" 
                    data-dismiss="modal"
                >Fechar</button>
                <button 
                    type="submit" 
                    className="btn btn-primary"
                    onClick={cadastrarInsumo}
                >Salvar alterações</button>
          </div>
          </div>
       </div>
      </div> 
      {/* Modal saida de insumos */}
      <div className="modal fade modal-saida-insumo" tabIndex="-1" role="dialog" aria-labelledby="myExtraLargeModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
              <div className="modal-content">
              <div className="modal-header">
                  <h5 className="modal-title">Saída de Insumos</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                  </button>
              </div>
              <div className="modal-body">
                  <form>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlSelect1">Selecione o Insumo</label>
                        <select value={selectedInsumo} onChange={e => {
                                setSelectedInsumo(e.target.value);
                            }} 
                            className="form-control" id="exampleFormControlSelect1"
                            >
                                <option>/** Insumo **\</option>
                                {insumos.map(insumo => {
                                    return (
                                        <option key={insumo.id}>{insumo.name}</option>
                                    )   
                                })}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantidade">Quantidade</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="quantidade" 
                            value={quantidade}
                            onChange={e => setQuantidade(e.target.value)} 
                            aria-describedby="quantidadeHelp" 
                            placeholder="Digite a quantidade"
                        />
                        <small id="quantidadeHelp" className="form-text text-muted">As casas decimais devem ser escritas com ponto</small>
                    </div>
                </form>

              </div>
              <div className="modal-footer">
                      <button 
                          type="button" 
                          className="btn btn-secondary" 
                          data-dismiss="modal"
                      >Fechar</button>
                      <button 
                          type="button" 
                          className="btn btn-primary"
                          onClick={saida}
                      >Salvar alterações</button>
                  </div>
              </div>
          </div>
      </div>     
    {/* Modal compras de insumos */}
    <div className="modal fade modal-compra-insumo" tabIndex="-1" role="dialog" aria-labelledby="myExtraLargeModalLabel" aria-hidden="true">
          <div className="modal-dialog modal-lg">
              <div className="modal-content">
              <div className="modal-header">
                  <h5 className="modal-title">Compra de Insumo</h5>
                  <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                  </button>
              </div>
              <div className="modal-body">
                  <form>
                    <div className="form-group">
                        <label htmlFor="exampleFormControlSelect1">Selecione o Insumo</label>
                        <select value={selectedInsumo} onChange={e => {
                                setSelectedInsumo(e.target.value);
                            }} 
                            className="form-control" id="exampleFormControlSelect1"
                            >
                                <option>/** Insumo **\</option>
                                {insumos.map(insumo => {
                                    return (
                                        <option key={insumo.id}>{insumo.name}</option>
                                    )   
                                })}
                        </select>
                    </div>
                    <div className="form-group">
                        <label htmlFor="quantidade">Quantidade</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="quantidade" 
                            value={quantidade}
                            onChange={e => setQuantidade(e.target.value)} 
                            aria-describedby="quantidadeHelp" 
                            placeholder="Digite a quantidade"
                        />
                        <small id="quantidadeHelp" className="form-text text-muted">As casas decimais devem ser escritas com ponto</small>
                    </div>
                    <div className="form-group">
                        <label htmlFor="custo">Custo de aquisição</label>
                        <input 
                            type="text" 
                            className="form-control" 
                            id="custo" 
                            value={custo}
                            onChange={e => setCusto(e.target.value)} 
                            aria-describedby="custoHelp" 
                            placeholder="Digite o custo"
                        />
                        <small id="custoHelp" className="form-text text-muted">Deve ser informado o custo total do insumo</small>
                    </div>
                </form>

              </div>
              <div className="modal-footer">
                      <button 
                          type="button" 
                          className="btn btn-secondary" 
                          data-dismiss="modal"
                      >Fechar</button>
                      <button 
                          type="button" 
                          className="btn btn-primary"
                          onClick={compra}
                      >Salvar alterações</button>
                  </div>
              </div>
          </div>
      </div> 

    </div>
  )
}