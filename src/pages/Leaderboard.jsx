import React, { useEffect, useState } from 'react';
import { Link } from "wouter";
import {
    Title,
    Text,
    SimpleGrid,
    Badge,
    Card,
    Radio,
    Table,
    Button,
    ScrollArea,
    Group
} from '@mantine/core';

import { appStore, ticketStore, leaderboardStore } from '../lib/states';

function humanReadableFloat(satoshis, precision) {
    return satoshis / Math.pow(10, precision)
}

export default function Leaderboard(properties) {
    const btsLeaderboard = leaderboardStore((state) => state.bitshares)
    const btsTestnetLeaderboard = leaderboardStore((state) => state.bitshares_testnet)
    const tuscLeaderboard = leaderboardStore((state) => state.tusc)

    const [value, setValue] = useState('bitshares');

    let assetName = "1.3.0";
    let leaderboardJSON = [];
    if (value === 'bitshares') {
        leaderboardJSON = btsLeaderboard;
        assetName = "BTS";
    } else if (value === 'bitshares_testnet') {
        leaderboardJSON = btsTestnetLeaderboard;
        assetName = "TEST";
    } else if (value === 'tusc') {
        leaderboardJSON = tuscLeaderboard;
        assetName = "TUSC"
    }

    let tableRows = leaderboardJSON.map((ticket) => {
        return <tr key={ticket.id}>
                    <td>
                        <Link href={`/Account/${value}/${ticket.id}`}>
                            {ticket.id}
                        </Link>
                    </td>
                    <td>{ticket.amount}</td>
                    <td width={200}>
                        {
                            ticket.tickets.map(id => {
                                return <Link href={`/Ticket/${value}/${id}`}>
                                            <Badge style={{margin:'1px'}}>{id}</Badge>
                                        </Link>
                            })
                        }
                    </td>
                    <td>{ticket.percent.toFixed(5)}</td>
                    <td>{ticket.range.from}</td>
                    <td>{ticket.range.to}</td>
                </tr>
    })

    return (<>
        <Card shadow="md" radius="md" padding="xl" style={{marginTop:'25px'}}>
            <Title order={2} ta="center" mt="sm">
                Blockchain ticket leaderboards
            </Title>

            <Radio.Group
                value={value}
                onChange={setValue}
                name="chosenBlockchain"
                label="Select the target blockchain"
                description="Graphene based blockchains only"
                withAsterisk
            >
                <Group mt="xs">
                    <Radio value="bitshares" label="Bitshares" />
                    <Radio value="bitshares_testnet" label="Bitshares (Testnet)" />
                    <Radio value="tusc" label="TUSC" />
                </Group>
            </Radio.Group>
        </Card>

        {
            !tableRows || !tableRows.length 
            ?   <Card shadow="md" radius="md" padding="xl" style={{marginTop:'25px'}}>
                    <Title order={3} ta="center" mt="sm">
                        You must fetch the ticket data for this blockchain.
                    </Title>
                </Card>
            :   <Card shadow="md" radius="md" padding="xl" style={{marginTop:'25px'}}>
                    <Table>
                        <thead>
                            <tr>
                                <th>User ID</th>
                                <th>Boosted Amount</th>
                                <th>Tickets</th>
                                <th>Percent</th>
                                <th>Ticket # from</th>
                                <th>Ticket # to</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tableRows}
                        </tbody>
                    </Table>
                </Card>
        }
    </>);
}