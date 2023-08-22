/// <reference types="cypress" />

import { format,prepareLocalStorage} from '../support/utils'


context('Dev Finances Agilizei', () => {

    beforeEach(() => {
        cy.visit('https://dev-finance.netlify.app/#',{

        onBeforeLoad:(win)=>
            prepareLocalStorage(win)
        })
    });
    it('cadastrar entradas', () => {
        cy.get('#transaction .button').click()
        cy.get('#description').type('mesada')
        cy.get('#amount').type(12)
        cy.get('#date').type('2023-08-08')
        cy.get('button').contains('Salvar').click()
        cy.get('#data-table tbody tr').should('have.length', 3)
    });
    it('cadastrar saidas', () => {
        cy.get('#transaction .button').click()
        cy.get('#description').type('mesada')
        cy.get('#amount').type(-12)
        cy.get('#date').type('2023-08-08')
        cy.get('button').contains('Salvar').click()
        cy.get('#data-table tbody tr').should('have.length', 3)
    });
    it('Remover entradas e saídas', () => {

       
        //estratégia 1: voltar para elemento pai, e avançar para um td img atr

        cy.get('td.description')
            .contains('Mesada')
            .parent()
            .find('img[onclick*=remove]')
            .click()

        //estratégia 2: buscar todos os irmãos, e buscar o que tem img + atributo

        cy.get('td.description')
            .contains('Suco Kapo')
            .siblings()
            .children('img[onclick*=remove]')
            .click()

    });

    it('validar saldos com diversas transações', () => {

        //capturar ass linhas com as transações 
        //formatar os valores da coluna
        //capturar o texto das colunas 
        //capturar o texto do total
        //comparar o somatório de entradas e despessa com o total
        
        let incomes = 0
        let expenses = 0

        cy.get('#data-table tbody tr')
            .each(($el, index, $list) => {
                cy.get($el).find('td.income, td.expense').invoke('text').then(Text => {
                    if(Text.includes('-')){
                        expenses = expenses + format(Text)
                    } else {
                        incomes = incomes + format(Text)
                    }
                    cy.log(`entradas`, incomes)
                    cy.log(`saidas`, expenses)

                })
            })

            cy.get('#totalDisplay').invoke('text').then(Text => {
                let formattedTotalDisplay = format(Text)
                let expectedTotal = incomes + expenses
                expect (formattedTotalDisplay).to.eq(expectedTotal)

            })
            
    });
});