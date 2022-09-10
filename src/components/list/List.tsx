import React from 'react';
import { Table } from 'react-bootstrap';
import CustomScrollbars from '../misc/CustomScrollbars';

export default function List(props: { children?: React.ReactNode }) {
    return (
        <CustomScrollbars>
            <Table className="text-light">
                <colgroup>
                    <col width="0%" />
                    <col width="60%" />
                    <col width="40%" />
                </colgroup>
                <tbody>{props.children}</tbody>
            </Table>
        </CustomScrollbars>
    );
}
