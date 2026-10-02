import { HandleDotVerticalOutlined } from 'jimu-icons/outlined/application/handle-dot-vertical'
import { styled } from 'jimu-theme'

const RootDiv = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  .drag-handler {
    visibility: hidden;
    flex-shrink: 0;
  }

  &:hover {
    .drag-handler { visibility: visible; }
  }
`

export function CollapseHeader (props: { label: string }) {
  return (
    <RootDiv>
      <HandleDotVerticalOutlined className="drag-handler" />
      <span className="label1 text-paper text-truncate mb-0">{props.label}</span>
    </RootDiv>
  )

}
