import React, {FC} from 'react';
import { Switch, Route } from 'react-router-dom';
import CreateTableForm from "../create-table-form";
import TablesList from "../tables-list";
import Table from "../table";
import MainNav from "../main-nav";

const TablesContainer: FC = () => {
    return (
        <Switch>
            <Route render={() => {
                return <MainNav />
            }} path="/" exact/>
            <Route component={CreateTableForm} path="/create" />
            <Route component={TablesList} path="/tables" exact />
            <Route render={({match}) => {
                return <Table id={match.params.id}/>
            }} path="/tables/:id" />
        </Switch>
    )
}

export default TablesContainer;