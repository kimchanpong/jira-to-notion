function HistoryLoading(props) {
    return(
        <div>
            processing..({props.successCount}/{props.totalCount})
        </div>
    )
}

export default HistoryLoading;