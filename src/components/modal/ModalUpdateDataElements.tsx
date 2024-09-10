import { useHeader } from "../../hooks";
import GroupForm from "../form/GroupForm";
import { ModalTable } from "./ModalTable";
import React from "react";
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
    const { updateEvents, loading } = useUpdateEvent({ setOpen })
    const cols = columns.filter(x => x.rawId === getDataStoreData.monitoria.facilitadores.treinador || x.id === 'eventDate')

    function save(values: any) {
        let events: any[] = []
        Object.keys(selectedEvents).map((event: any) => {
            events.push({
                ...selectedEvents?.[event], dataValues: [...selectedEvents?.[event].dataValues.filter((x: any) => x.dataElement != getDataStoreData.monitoria.facilitadores.treinador),
                {
                    dataElement: getDataStoreData.monitoria.facilitadores.treinador,
                    value: values[getDataStoreData.monitoria.facilitadores.treinador]
                }],
                eventDate: values.eventDate,
                occurredAt: values.eventDate
            })
        })

        void updateEvents(events)
    }

    return (
        <div style={{ maxHeight: "70vh" }} >
            <span> {Object.keys(selectedEvents).length} ASCAS selecionadas serão afectadas:</span>
            <ModalTable tableData={tableData} />
            <br />
            <Form onSubmit={() => { }} >
                {({ values, pristine }) => (
                    <form >
                        <GroupForm fields={cols} name="Data do curso e nome do treinador" disabled={false} description="" />
                        <br />
                        <ButtonStrip end>
                            <Button onClick={() => setOpen(false)}>Cancelar</Button>
                            <Button icon={loading && <CircularLoader small />} disabled={loading || pristine} onClick={() => save(values)} primary>

                                Actualizar
                            </Button>
                        </ButtonStrip>
                    </form>
                )}
            </Form>
        </div>
    )
}