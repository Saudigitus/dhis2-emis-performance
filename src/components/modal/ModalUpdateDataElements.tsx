import { useHeader } from "../../hooks";
import GroupForm from "../form/GroupForm";
import { ModalTable } from "./ModalTable";
import React, { useState } from "react";
import { Button, ButtonStrip, CenteredContent, CircularLoader } from "@dhis2/ui";
import { Form } from "react-final-form";
import { getSelectedKey } from "../../utils";
import { RowSelectorState } from "../../schema/rowSelectorSchema";
import { useRecoilValue } from "recoil";
import useUpdateEvent from "../../hooks/events/useUpdateEvents";

export default function ModalEdit({ tableData, setOpen }: { setOpen: (args: boolean) => void, tableData: any }) {
    const { columns } = useHeader();
    const { getDataStoreData } = getSelectedKey()
    const selectedEvents = useRecoilValue(RowSelectorState)
    const cols = columns.filter(x => x.rawId === getDataStoreData.monitoria.facilitadores.treinador || x.id === 'eventDate')
    const { updateEvents, loading } = useUpdateEvent({ setOpen })

    function save(values: any) {
        let events: any[] = []

        Object.keys(selectedEvents).map((event: any) => {
            events.push({
                ...selectedEvents?.[event], dataValues: [...selectedEvents?.[event].dataValues,
                {
                    dataElement: getDataStoreData.monitoria.facilitadores.treinador,
                    value: values[getDataStoreData.monitoria.facilitadores.treinador]
                }],
                eventDate: values.eventDate
            })
        })

        void updateEvents(events)
    }

    return (
        <div style={{ maxHeight: "70vh" }} >
            <span>ASCAS que serão afectadas:</span>
            <ModalTable tableData={tableData} />
            <br />
            <Form onSubmit={() => { }} >
                {({ values, pristine }) => (
                    <form >
                        <GroupForm fields={cols} name="Data do curso e nome do treinador" disabled={false} description="" />
                        <br />
                        <ButtonStrip end>
                            <Button onClick={() => setOpen(false)}>Cancelar</Button>
                            <Button disabled={loading || pristine} onClick={() => save(values)} primary>
                                {loading ? <CenteredContent>
                                    <CircularLoader small />
                                </CenteredContent>
                                    :
                                    "Actualizar"
                                }
                            </Button>
                        </ButtonStrip>
                    </form>
                )}
            </Form>
        </div>
    )
}